const {problemController} =require("../../controller");


const resolverQuery ={
    problems: async (_, { title }) => await problemController.getProblem({ title }),
    getRandomProblem: async (_, { difficulty }) => await problemController.getRandomProblem({ difficulty }),
}

const resolverMutation={
    createProblem: async (_, problem) =>await problemController.createProblem(problem.newProblem),
    approveProblem: async (_, { id }) =>await problemController.approveProblem({ problemId: id }),
    deleteProblem: async (_, { id }) =>{
        await problemController.deleteProblem({ id: id })
        return "Problem Deleted";
    },
    updateProblem: async (_,problemData) =>await problemController.updateProblem(problemData.updateProblemData),

}

module.exports={resolverQuery,resolverMutation};