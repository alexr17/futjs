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
            const player_info = await Player.get_obj('player_info', 'id', this.data.player_info_id, false);
            const rarity_id = player_info.rarityid;
            const level_id = (league_id == 45 || player_info.rarityid >= 24 ? 0 : player_info.quality+1); //0 if icon, other use quality level
            this.font_color_style = font_color(rarity_id);

            this.imgs = {}
            this.imgs.base_player_url = `https://cdn.futbin.com/content/fifa19/img/players/${this.data.base_fut_id}.png`;
            let str = (this.data.fut_id == this.data.base_fut_id ? '' : 'p')
            this.imgs.player_url = `https://cdn.futbin.com/content/fifa19/img/players/${str}${this.data.fut_id}.png`;
            this.imgs.club_url = `https://cdn.futbin.com/content/fifa19/img/clubs/${club_id}.png`;
            this.imgs.nation_url = `https://cdn.futbin.com/content/fifa19/img/nation/${nation_id}.png`;
            this.imgs.league_url = `https://cdn.futbin.com/content/fifa19/img/league/${league_id}.png`;
            this.imgs.shell_url = `https://www.easports.com/fifa/ultimate-team/web-app/content/7D49A6B1-760B-4491-B10C-167FBC81D58A/2019/fut/items/images/backgrounds/itemCompanionBGs/large/cards_bg_e_1_${rarity_id}_${level_id}.png`;
            return this.imgs;
        }
        else {
            console.log("Invalid data for player")
        }
    }
}

const font_color = function(shell_id) {
    //BASE
    if (shell_id == 1) {
        return "rgb(70, 57, 12);";
    }

    //UEFA
    if ([68, 48, 70].includes(shell_id)) {
        return "rgb(245, 245, 245);";
    }

    //OTW
    if (shell_id == 21) {
        return "rgb(255, 71, 130);";
    }

    //SPECIAL
    return "rgb(235, 205, 91);";
}

module.exports = Player;