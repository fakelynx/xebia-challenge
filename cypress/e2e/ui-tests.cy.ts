import { ActorLocators } from "../locators/actor.registry";
import { BornTodayLocators } from "../locators/born-today.registry";
import { ChartsLocators } from "../locators/charts.registry";
import { GNavLocators } from "../locators/gnav.registry";
import { TitleLocators } from "../locators/title.registry";
import { TitlePhotosLocators } from "../locators/title-photos.registry";
import { ActorPage } from "../pages/ActorPage";
import { BornTodayPage } from "../pages/BornTodayPage";
import { GNav } from "../pages/GNav";
import { MovieChartsPage } from "../pages/MovieChartsPage";
import { TitlePage } from "../pages/TitlePage";
import { TitlePhotosPage } from "../pages/TitlePhotosPage";
import { TVChartsPage } from "../pages/TVChartsPage";
import { parseData } from "../support/csv";

describe("Actor + Upcoming Test", () => {
  const nav = new GNav(GNavLocators);
  const page = new ActorPage(ActorLocators);

  it(
    "given the IMDb homepage is open, when searching for an actor and expanding their upcoming section, then the second completed title can be selected",
    () => {
      parseData("ui-tests").then((data) => {
        cy.log("Step 1 — Visit the IMDb homepage");
        cy.visit("/");

        cy.log(`Step 2 — Search for actor: ${data.actorQuery}`);
        nav.search(data.actorQuery);

        cy.log("Step 3 — Expand the Upcoming accordion on the actor page");
        page.clickAccordion("upcomingAccordionToggle");

        cy.log(`Step 4 — Click the 1st item tagged "${data.upcomingTag}" in the upcoming list`);
        page.clickNthTaggedItem("unreleasedTitleElem", data.upcomingTag, 1);
      });
    }
  );
});

describe("TV Charts + Title Photos Filter Test", () => {
  const nav = new GNav(GNavLocators);
  const chartsPage = new TVChartsPage(ChartsLocators);
  const titlePage = new TitlePage(TitleLocators);
  const photosPage = new TitlePhotosPage(TitlePhotosLocators);

  it(
    "given the IMDb homepage is open, when navigating to TV charts via the hamburger menu and opening a title's photos, then filtering by a person name and clicking the 2nd photo works",
    () => {
      parseData("ui-tests").then((data) => {
        cy.log("Step 1 — Visit the IMDb homepage");
        cy.visit("/");

        cy.log("Step 2 — Open the hamburger navigation menu");
        nav.openHamburgerMenu();

        cy.log("Step 3 — Click the TV Charts link in the nav drawer");
        nav.clickHamburgerMenuItem("tvCharts");

        cy.log(`Step 4 — Click the title "${data.tvTitle}" in the chart list`);
        chartsPage.clickTitleByName(data.tvTitle);

        cy.log("Step 5 — Navigate to the Photos section of the title page");
        titlePage.navigateToPhotos();

        cy.log("Step 6 — Open the photo filter panel");
        photosPage.clickFilterButton();

        cy.log(`Step 7 — Select the filter option "${data.tvPhotosFilter}"`);
        photosPage.selectFilterOption(data.tvPhotosFilter);

        cy.log("Step 8 — Click the 2nd photo in the filtered gallery");
        photosPage.clickPhotoByPosition(2);
      });
    }
  );
});

describe("Movie Charts + Title Rating Test", () => {
  const nav = new GNav(GNavLocators);
  const chartsPage = new MovieChartsPage(ChartsLocators);
  const titlePage = new TitlePage(TitleLocators);

  it(
    "given the IMDb homepage is open, when navigating to movie charts via the hamburger menu and selecting the 2nd title, then it can be rated 10 stars",
    () => {
      cy.log("Step 1 — Visit the IMDb homepage");
      cy.visit("/");

      cy.log("Step 2 — Open the hamburger navigation menu");
      nav.openHamburgerMenu();

      cy.log("Step 3 — Click the Movie Charts link in the nav drawer");
      nav.clickHamburgerMenuItem("movieCharts");

      cy.log("Step 4 — Click the 2nd title in the chart list");
      chartsPage.clickTitleByPosition(2);

      cy.log("Step 5 — Rate the title 10 stars");
      titlePage.rate(10);
    }
  );
});

describe("Born Today — yesterday's born celebrities", () => {
  const nav = new GNav(GNavLocators);
  const bornTodayPage = new BornTodayPage(BornTodayLocators);

  it(
    "given the IMDb homepage is open, when navigating to Born Today and filtering by yesterday's date, then the 3rd celebrity's page loads and a screenshot is captured",
    () => {
      cy.log("Step 1 — Visit the IMDb homepage");
      cy.visit("/");

      cy.log("Step 2 — Open the hamburger navigation menu");
      nav.openHamburgerMenu();

      cy.log("Step 3 — Click the Born Today link in the nav drawer");
      nav.clickHamburgerMenuItem("bornTodayList");

      cy.log("Step 4 — Remove the default filter chip");
      bornTodayPage.removeFilterChips();

      cy.log("Step 5 — Unfold the Birth Date accordion");
      bornTodayPage.unfoldAccordion("Birth Date");

      cy.log("Step 6 — Enter yesterday as the date and apply");
      bornTodayPage.enterRelativeDate({ days: 1 });

      cy.log("Step 7 — Click the 3rd celebrity in the results");
      bornTodayPage.clickCelebrityByPosition(3);

      cy.log("Step 8 — Screenshot of the fully loaded celebrity page");
      cy.screenshot("born-today-yesterday-celebrity-3");
    }
  );
});

describe("Born Today — celebrities born 40 years ago", () => {
  const nav = new GNav(GNavLocators);
  const bornTodayPage = new BornTodayPage(BornTodayLocators);

  it(
    "given the IMDb homepage is open, when navigating to Born Today and filtering by a date 40 years ago, then the first celebrity's page is optionally opened and a screenshot captured",
    () => {
      cy.log("Step 1 — Visit the IMDb homepage");
      cy.visit("/");

      cy.log("Step 2 — Open the hamburger navigation menu");
      nav.openHamburgerMenu();

      cy.log("Step 3 — Click the Born Today link in the nav drawer");
      nav.clickHamburgerMenuItem("bornTodayList");

      cy.log("Step 4 — Remove the default filter chip");
      bornTodayPage.removeFilterChips();

      cy.log("Step 5 — Unfold the Birth Date accordion");
      bornTodayPage.unfoldAccordion("Birth Date");

      cy.log("Step 6 — Enter a date 40 years ago and apply");
      bornTodayPage.enterRelativeDate({ years: 40 });

      cy.log("Step 7 — Attempt to click the 1st celebrity (skipped if results are empty)");
      let celebrity1Clicked = false;
      bornTodayPage.clickCelebrityByPosition(1, {
        soft: true,
        onSuccess: () => {
          celebrity1Clicked = true;
        },
      });

      cy.log("Step 8 — Screenshot of the celebrity page, only if navigation succeeded");
      cy.then(() => {
        if (celebrity1Clicked) {
          cy.screenshot("born-today-40-years-celebrity-1");
        }
      });
    }
  );
});
