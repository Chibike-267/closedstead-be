import UserRouter from "./users/router";
import ReservationRouter from "./reservations/router";
import UnitsRouter from "./units/router";

export = {
  users: {
    routes: UserRouter,
  },
  reservations: {
    routes: ReservationRouter,
  },
  units: {
    routes: UnitsRouter,
  },
};
