import { validationFailed } from './errors'

/**
 * Collects bean-validation style problems ("field: message") and throws them together as
 * the backend's 400 "Validation failed". Null/undefined pass every rule except `notBlank`
 * and `notEmpty`, exactly like the Jakarta annotations the DTOs use.
 */
export class Validator {
  private readonly issues: string[] = []

  private readonly body: Record<string, unknown>

  constructor(body: object) {
    this.body = body as Record<string, unknown>
  }

  private fail(field: string, message: string): this {
    this.issues.push(`${field}: ${message}`)
    return this
  }

  private text(field: string): string | null {
    const value = this.body[field]
    return typeof value === 'string' ? value : null
  }

  notBlank(field: string, message = 'must not be blank'): this {
    const value = this.text(field)
    return value === null || value.trim() === '' ? this.fail(field, message) : this
  }

  notNull(field: string, message = 'must not be null'): this {
    return this.body[field] === undefined || this.body[field] === null ? this.fail(field, message) : this
  }

  notEmpty(field: string, message = 'must not be empty'): this {
    const value = this.body[field]
    return Array.isArray(value) && value.length > 0 ? this : this.fail(field, message)
  }

  email(field: string, message = 'must be a well-formed email address'): this {
    const value = this.text(field)
    return value && !EMAIL.test(value) ? this.fail(field, message) : this
  }

  minLength(field: string, min: number, message: string): this {
    const value = this.text(field)
    return value !== null && value.length < min ? this.fail(field, message) : this
  }

  maxLength(field: string, max: number, message = `size must be between 0 and ${max}`): this {
    const value = this.text(field)
    return value !== null && value.length > max ? this.fail(field, message) : this
  }

  oneOf(field: string, allowed: readonly string[], message: string): this {
    const value = this.text(field)
    return value !== null && !allowed.includes(value) ? this.fail(field, message) : this
  }

  /** Throws the accumulated problems, if any. */
  check(): void {
    if (this.issues.length > 0) throw validationFailed(this.issues)
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
