import LandingPage from "./landing-page";
import { landingPageMetadata } from "./landing-metadata";

export const metadata = landingPageMetadata;

export default function Home() {
  return <LandingPage />;
}
