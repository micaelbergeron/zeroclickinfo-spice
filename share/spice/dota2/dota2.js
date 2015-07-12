(function (env) {
    "use strict";

    if (!String.prototype.format) {
      String.prototype.format = function(args) {
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }

    env.constants = { stat_names: ["Strength", "Agility", "Intelligence"], melee_attack_range: 128 };

    env.convert = {};

    env.convert.noop = function(value) {
        return value;
    };

    env.convert.primary_stat = function(values) {
        return $.map(values, function(stat_index) {
            return env.constants.stat_names[stat_index];
        });
    };

    env.convert.sec_to_ms = function(values) {
        return $.map(values, function(sec_value) {
            return sec_value * 1000;
        });
    };

    env.convert.time_to_turn = function(values) {
        return $.map(values, function(turnrate) {
            return Math.round(0.03 * Math.PI / turnrate * 1000);
        });
    };

    env.convert.armor = function(values) {
        return $.map(values, function(value) {
            return Math.round((0.06 * value) / (1 + (0.06 * value)) * 100 * 100, 2) / 100;
        });
    };

    env.convert.attack_range = function(values) {
        if (values[0] == env.constants.melee_attack_range) {
            values[0] = "Melee";
        }

        return values;
    };

    env.ddg_spice_dota2 = function(api_result){

        if (!api_result || api_result.error) {
            return Spice.failed('dota2');
        }

        var item = { label: "default", template: "{0}", convert: env.convert.noop };

        var infoboxItems = [
            $.extend(Object.create(item), { label: "Movement speed", values:["Movespeed"] }),
            $.extend(Object.create(item), { label: "Damage", values:["MinDmg", "MaxDmg"], template: "{0} - {1}" }),
            $.extend(Object.create(item), { label: "Health", values:["HP", "HPRegen"], template: "{0} (+ {1} HP/s)" }),
            $.extend(Object.create(item), { label: "Mana", values:["Mana", "ManaRegen"], template: "{0} (+ {1} MP/s)" }),
            $.extend(Object.create(item), { label: "Armor", values:["Armor"], template: "{0}%", convert: env.convert.armor }),
            $.extend(Object.create(item), { label: "Attack range", values:["Range"], template: "{0}", convert: env.convert.attack_range }),
            $.extend(Object.create(item), { label: "Strength", values:["BaseStr", "StrGain"], template: "{0} (+ {1}/lvl)" }),
            $.extend(Object.create(item), { label: "Agility", values:["BaseAgi", "AgiGain"], template: "{0} (+ {1}/lvl)" }),
            $.extend(Object.create(item), { label: "Intelligence", values:["BaseInt", "IntGain"], template: "{0} (+ {1}/lvl)" }),
            $.extend(Object.create(item), { label: "Primary stat", values:["PrimaryStat"], template: "{0}", convert: env.convert.primary_stat }),
            $.extend(Object.create(item), { label: "Base attack time", values:["BaseAttackTime"], template: "{0}" }),
            $.extend(Object.create(item), { label: "Vison", values:["DayVision", "NightVision"], template: "{0} day, {1} night" }),
            $.extend(Object.create(item), { label: "Attack point / swing", values:["AttackPoint", "AttackSwing"], template: "{0} / {1} ms", convert: env.convert.sec_to_ms }),
            $.extend(Object.create(item), { label: "Cast point / swing", values:["CastPoint", "CastSwing"], template: "{0} / {1} ms", convert: env.convert.sec_to_ms }),
            $.extend(Object.create(item), { label: "Turnrate", values:["Turnrate"], template: "{0} ms/180°", convert: env.convert.time_to_turn }),
            $.extend(Object.create(item), { label: "Legs", values:["Legs"], template: "{0}" })
        ];

        if (api_result["Range"] != env.constants.melee_attack_range) {
            infoboxItems.push($.extend(Object.create(item), { label: "Projectile speed", values:["ProjectileSpeed"] }));
        }

        var infoboxData = [{
            heading: 'Hero Details',
        }];

        var index;
        var len = infoboxItems.length;

        for (index = 0; index < len; ++index) {
            var values = $.map(infoboxItems[index].values, function(key) {
                return api_result[key];
            });

            infoboxData.push({
                label: infoboxItems[index].label,
                value: infoboxItems[index].template.format(infoboxItems[index].convert(values))
            });
        }

        Spice.add({
            id: "dota2",
            name: "Dota 2 hero",
            data: api_result,
            meta: {
                sourceName: "herostats.io",
                sourceUrl: "http://herostats.io"
            },
            normalize: function(item) {
                return {
                    title: item.Name,
                    url: "http://herostats.io/",
                    image:  "http://herostats.io/img/portraits/large/{0}_large.png".format([item.Name.toLowerCase()]),
                    infoboxData: infoboxData
                };
            },
            templates: {
                group: 'info'
            }
        });
    };
}(this));