import { HomePage } from "./home-page";
import { AppHeader } from "@/components/app-header";

const Home = () => (
  <>
    <AppHeader
      cartItemsCount={2}
      pizzeriaName="Вкусно Дома"
      topLinks={[
        { href: "/", label: "Главная" },
        { href: "/#menu", label: "Меню" },
        { href: "/#promotions", label: "Акции" },
        { href: "/contacts", label: "Контакты" },
      ]}
    />
    <HomePage />
  </>
);

export default Home;
