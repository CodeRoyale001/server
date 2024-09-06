const mutation=`#graphql
    type Mutation{
        createProblem(newProblem:ProblemInput):Problem
        approveProblem(id:ID!):Problem
        deleteProblem(id:ID!):String
        updateProblem(updateProblemData:updateProblemData):Problem
    }
`
module.exports=mutation;