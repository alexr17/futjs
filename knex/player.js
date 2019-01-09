const GenericFutObj = require('./generic.js');
const util = require('../public/javascripts/util.js');
//const Nightmare = require('nightmare');
//const nightmare = Nightmare({ show: false });
//const selector = 'body > div.container-outer > div > div.body-outer > div.ng-view.ng-scope > div:nth-child(1) > div.ut-bio.ut-underlay.ng-scope > div.ut-body-inner > div > div.ut-bio-details_shell > div > div.ut-item-container_header > item-view';

class Player extends GenericFutObj {
    constructor(data, _) {
        super(data, "players");
    }

    async set_img_urls() {
        if (this.data && this.data.fut_id && this.data.base_fut_id) {
            const club_id = (await Player.get_obj('clubs', 'id', this.data.club_id, false)).fut_id;
            const nation_id = (await Player.get_obj('nations', 'id', this.data.nation_id, false)).fut_id;
            const league_id = (await Player.get_obj('leagues', 'id', this.data.league_id, false)).fut_id;

            this.imgs = {}
            this.imgs.base_player_url = `https://cdn.futbin.com/content/fifa19/img/players/${this.data.base_fut_id}.png`;
            let str = (this.data.fut_id == this.data.base_fut_id ? '' : 'p')
            this.imgs.player_url = `https://cdn.futbin.com/content/fifa19/img/players/${str}${this.data.fut_id}.png`;
            this.imgs.club_url = `https://cdn.futbin.com/content/fifa19/img/clubs/${club_id}.png`;
            this.imgs.nation_url = `https://cdn.futbin.com/content/fifa19/img/nation/${nation_id}.png`;
            this.imgs.league_url = `https://cdn.futbin.com/content/fifa19/img/league/${league_id}.png`;
            return this.imgs;
        }
        else {
            console.log("Invalid data for player")
        }
    }
}

module.exports = Player;