// @ts-nocheck
import jwt from "jsonwebtoken";
import { mutationField, stringArg } from "@nexus/schema";

export const loginMutation = mutationField("login", {
  type: "Login",
  args: {
    phoneNumber: stringArg(),
  },
  resolve: async (parent, args, ctx) => {
    const user = await ctx.prisma.user.findOne({
      where: {
        phoneNumber: args.phoneNumber,
      },
    });
    const token = jwt.sign(user, "development");
    return {
      user: user,
      token,
    };
  },
});
