// @ts-nocheck
import { objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.firebaseToken();
    t.model.phoneNumber();
  },
});

export const Login = objectType({
  name: "Login",
  definition(t) {
    t.field("user", {
      type: "User",
    });
    t.string("token");
  },
});
