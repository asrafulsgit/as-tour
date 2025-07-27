

// there are many type of error: server error handlers 
/**
 * 1. unhandled rejection error => this error come from promises. 
 *                                  sometimes forget to handle apis promise error like try{}catch{}. 
 *                                  when prmises occur an error this handler work for smoothly shoutdown the server.
 * 2. uncought rejection error => this error come from undifind variables like some times we are trying to use a variable which is not declared.
 * 3. signal termination error => this error come from production cloud server. sometimes we have to shoutdown our server for few minutes or more at this time we can shoutdown our server perfectly.
 */