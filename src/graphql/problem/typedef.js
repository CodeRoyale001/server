const typeDef=`#graphql
input ProblemInput {
    title: String!
    content: String!
    createdBy: String!
    tags: [String]
    difficulty: String
    approved: Boolean!
}
input updateProblemData{
    id: ID
    title: String
    content: String
    createdBy: String
    tags: [String]
    difficulty: String
    approved: Boolean

}
type Problem {
    id: ID!
    title: String!
    content: String!
    createdBy: String!
    tags: [String]
    difficulty: String!
    approved: Boolean!
}`

module.exports=typeDef;