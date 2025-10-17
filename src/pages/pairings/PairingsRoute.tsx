import { useIsMobile } from "@/hooks/use-mobile";
import PairingsPage from "./PairingsPage";
import MobilePairingsRouter from "./MobilePairingsRouter";

const PairingsRoute = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobilePairingsRouter /> : <PairingsPage />;
};

export default PairingsRoute;
