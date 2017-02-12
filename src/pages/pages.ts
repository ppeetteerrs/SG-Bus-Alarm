import { HomePage } from './home/home';
import { Page1 } from './page1/page1';

export { HomePage } from './home/home';
export { Page1 } from './page1/page1';

//First One is RootPage
export const Pages = [HomePage, Page1];
    
export const RootPage = HomePage;

export const Details = [
        {title: "Home", component: HomePage},
        {title: "Page 1", component: Page1}
]
