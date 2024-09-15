const query=`#graphql
type Query{
    problems(title: String): [Problem]
    getRandomProblem(difficulty: String): Problem
}
`

module.exports=query;