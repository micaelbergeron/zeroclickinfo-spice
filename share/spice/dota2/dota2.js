(function (env) {
    "use strict";
    env.ddg_spice_dota2 = function(api_result){

        // Validate the response (customize for your Spice)
        if (!api_result || api_result.error) {
            return Spice.failed('dota2');
        }

        // Render the response
        Spice.add({
            id: "dota2",

            // Customize these properties
            name: "DoTA2 Hero",
            data: api_result,
            meta: {
                sourceName: "herostats.io",
                sourceUrl: "http://herostats.io"
            },
            templates: {
                group: 'your-template-group',
                options: {
                    content: Spice.dota2.content,
                    moreAt: true
                }
            }
        });
    };
}(this));
