export function checkSessionIdExistes(request,reply){
  const sessionId = request.cookies.sessionId
  if(!sessionId){
    return reply.status(401).send({
      error: 'Unauthorized'
    })
  }
}