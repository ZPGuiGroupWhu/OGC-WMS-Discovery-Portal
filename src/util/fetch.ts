export enum HttpMethod {
  get = 'GET',
  post = 'POST'
}

export interface IReqConfig {
  body?: any
  method?: string
  'Content-Type'?: string
}

const $req = async (url: string, config: IReqConfig) => {
  let promise: Response
  const reqUrl = url
  if (!config.method || config.method === HttpMethod.get) {
    promise = await fetch(reqUrl)
  } else {
    promise = await fetch(reqUrl, {
      body: JSON.stringify(config.body),
      headers: {
        'Content-Type': 'application/json'
      },
      method: HttpMethod.post,
      mode: 'no-cors'
    })
  } 
  return handleRes(promise)
}

const handleRes = async (res: Response) => {
  const parsedRes = await parseRes(res)
  // if res.ok, the request is succesful
  if (res.ok) {
    return parsedRes
  }
  // if request failed, return the failed data
  const error = parsedRes
  throw error
}

const parseRes = async (res: Response) => {
  const contentType = res.headers.get('Content-Type')
  // accroding to the response type, to do different handler
  if (contentType) {
    if (contentType.indexOf('json') > -1) {
      return await res.json()
    }
    if (contentType.indexOf('text') > -1) {
      return await res.text()
    }
  }
  return await res.text()
}

export default $req