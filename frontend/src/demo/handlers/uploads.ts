import { badRequest } from '../http/errors'

const MAX_SIDE = 256

/**
 * Avatar/logo "upload" without a server: the image is shrunk and returned as a data URL.
 * Shrinking matters: the state lives in sessionStorage (~5 MB), and a raw phone photo as
 * base64 would fill it. A data URL (unlike an object URL) also survives a page reload.
 */
export async function imageToDataUrl(body: unknown): Promise<string> {
  const file = body instanceof FormData ? body.get('file') : null
  if (!(file instanceof File)) throw badRequest('Required parameter missing: file')

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw badRequest('The uploaded file is not a valid image')
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  // PNG keeps the transparency of logos; everything else is smaller as JPEG.
  return file.type === 'image/png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.85)
}
