const { problemController } = require("../../controller");

const resolverMutation = {
  createProblem: async (_, problem, context) => {
    console.log(context);
    if (context.user && context.user.userRole === 0) {
      return await problemController.createProblem(problem.newProblem);
    } else {
      throw new Error("You are not authorized to create a problem");
    }
  },
  approveProblem: async (_, { id }, context) => {
    // Assuming role 1 is for admin or similar role who can approve
    if (context.user && context.user.userRole === 1) {
      return await problemController.approveProblem({ problemId: id });
    } else {
      throw new Error("You are not authorized to approve problems");
    }
  },
  deleteProblem: async (_, { id }, context) => {
    if (context.user && context.user.userRole === 1) {
      await problemController.deleteProblem({ id: id });
      return "Problem Deleted";
    } else {
      throw new Error("You are not authorized to delete problems");
    }
  },
  updateProblem: async (_, { updateProblemData }, context) => {
    if (context.user && context.user.userRole === 0) {
      return await problemController.updateProblem(updateProblemData);
    } else {
      throw new Error("You are not authorized to update problems");
    }
  }
};

module.exports = { resolverMutation };
