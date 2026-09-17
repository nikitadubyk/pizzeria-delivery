import { connection } from "next/server";
import { AddonsPage } from "./addons-page";

export default async function AddonsPageRoute() {
  await connection();
  return <AddonsPage />;
}
