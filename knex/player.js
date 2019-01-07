const GenericFutObj = require('./generic.js');
const util = require('../public/javascripts/util.js');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const selector = 'body > div.container-outer > div > div.body-outer > div.ng-view.ng-scope > div:nth-child(1) > div.ut-bio.ut-underlay.ng-scope > div.ut-body-inner > div > div.ut-bio-details_shell > div > div.ut-item-container_header > item-view';

class Player extends GenericFutObj {
    constructor(data, _) {
        super(data, "players");
    }

    async get_html() {
        if (this.data && this.data.fut_id && this.data.base_fut_id) {
            let url = `https://www.easports.com/fifa/ultimate-team/fut/database/player/${this.data.base_fut_id}#${this.data.fut_id}`
            this.html = await nightmare.goto(url).evaluate((selector) => {
                return document.querySelector(selector).outerHTML;
            }, selector);
        }
        else {
            console.log("Invalid data for player")
        }
    }
}

module.exports = Player;