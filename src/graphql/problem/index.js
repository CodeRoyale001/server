const mutation = require('./mutation');
const query = require('./queries');
const typedef= require('./typedef');
const {resolverQuery,resolverMutation} = require('./resolver');

module.exports ={
    problemMutation:mutation,
    problemQuery:query,
    problemTypedef:typedef,
    problemResolver:{query:resolverQuery,mutation:resolverMutation}
}

