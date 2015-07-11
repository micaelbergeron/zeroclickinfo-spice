package DDG::Spice::Dota2;
# ABSTRACT: Write an abstract here
# Start at https://duck.co/duckduckhack/spice_overview if you are new
# to instant answer development

use DDG::Spice;

# Caching - https://duck.co/duckduckhack/spice_advanced_backend#caching
spice is_cached => 1; 

# Metadata.  See https://duck.co/duckduckhack/metadata for help in filling out this section.
name "Dota2";
source "HeroStats";
icon_url "http://www.dota2.com/images/favicon.ico";
description "Present the basic information of a Dota2 hero";
primary_example_queries "dota2 earthshaker", "dota clinkz";
category "entertainment";
topics "gaming";
code_url "https://github.com/duckduckgo/zeroclickinfo-spice/blob/master/lib/DDG/Spice/Dota2.pm";
attribution github => ["micaelbergeron", "Micael Bergeron"],
			twitter => ["micaelbergeron", "Micael Bergeron"],
            twitter => ["ZoidQC", "Kaven Thériault"];

# API endpoint - https://duck.co/duckduckhack/spice_attributes#spice-codetocode
spice to => 'http://api.herostats.io/heroes/$1';

# Triggers - https://duck.co/duckduckhack/spice_triggers
triggers any => "dota", "dota2";

# Handle statement
handle remainder => sub {

    # optional - regex guard
    # return unless qr/^\w+/;

    # return unless $_;    # Guard against "no answer"

    # return $_;

    return $_ if $_;
    return;	
};

1;
