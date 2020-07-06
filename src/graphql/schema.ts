// @ts-nocheck
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import { makeSchema, queryType, mutationType, stringArg } from "@nexus/schema";
import { sign } from "jsonwebtoken";
import { User, Login } from "./schemas";

const Query = queryType({
  definition(t) {
    t.list.field("ListUsers", {
      type: "User",
      resolve(parent, args, ctx) {
        return ctx.prisma.user.findMany();
      },
    });
  },
});

const Mutation = mutationType({
  definition(t) {
    t.field("loginUser", {
      type: "Login",
      args: {
        phoneNumber: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        console.log(args);
        const user = await ctx.prisma.user.findOne({
          where: {
            phoneNumber: args.phoneNumber,
          },
        });
        if (!user) {
          throw new Error("No such user exists");
        }
        const token = sign(user, "development");
        console.log(token);
        return {
          user,
          token,
        };
      },
    });
    t.crud.createOneUser();
    t.crud.deleteOneUser();
    t.crud.updateOneUser();
    t.crud.upsertOneUser();
    t.crud.updateManyUser();
  },
});

export default makeSchema({
  types: [Query, Mutation, User, Login],
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});
