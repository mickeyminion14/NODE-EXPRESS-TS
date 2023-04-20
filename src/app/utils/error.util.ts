/**
 * @author sarthak agrawal
 * @description A utility class for response errors which inherit native error class to provide stack trace in app.
 * @argument status A status code to send back to client when error occur
 * @argument message A error message to send back to client when error occur
 * @argument errorCode A special optional error code to identifiy the error cause
 */
export class ResponseError extends Error {
  name = 'ResponseError';
  constructor(public status: number, message: string, public errorCode?: number) {
    super(message);
  }
}
