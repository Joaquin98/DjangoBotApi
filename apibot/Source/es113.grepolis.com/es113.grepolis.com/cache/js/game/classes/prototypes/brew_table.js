/*globals us, Backbone*/

(function() {
    'use strict';

    function BrewTable() {
        this.brew_table = [];

        this.brew_table.length = 3; //Initialize array with specific length;
    }

    BrewTable.prototype.brew_table = [];

    /**
     * Adds ingredients on the table
     *
     * @param {GameModels.HalloweenIngredient} ingredient
     * @param {Number} pos
     */
    BrewTable.prototype.addIngredient = function(ingredient, pos) {
        this.removeIngredient(pos);

        this.brew_table[pos] = ingredient;

        this.trigger('ingredient:add', ingredient, pos);
        this.trigger('table:' + (this.hasFreeSpot() ? 'not_full' : 'full'));
    };

    /**
     * Returns ingredient which is on the table on the specific position
     *
     * @param {Number} pos
     *
     * @returns {GameModels.HalloweenIngredient}
     */
    BrewTable.prototype.getIngredient = function(pos) {
        return this.brew_table[pos];
    };

    BrewTable.prototype.hasFreeSpot = function() {
        return this.getFreeSpotPosition() > -1;
    };

    BrewTable.prototype.isSlotFree = function(pos) {
        return typeof this.brew_table[pos] === 'undefined';
    };

    BrewTable.prototype.getFreeSpotPosition = function() {
        var brew_table = this.brew_table,
            i, l = brew_table.length;

        for (i = 0; i < l; i++) {
            if (this.isSlotFree(i)) {
                return i;
            }
        }

        return -1;
    };

    BrewTable.prototype.removeIngredient = function(pos) {
        var old_ingredient = this.getIngredient(pos),
            has_free_spot = this.hasFreeSpot();

        if (old_ingredient) {
            this.brew_table[pos] = undefined;
            this.trigger('ingredient:remove', old_ingredient, pos);

            if (!has_free_spot) {
                this.trigger('table:not_full');
            }
        }
    };

    BrewTable.prototype.getIngredientsAmount = function(ingredient_type) {
        var ingredient, brew_table = this.brew_table,
            i, l = brew_table.length,
            amount = 0;

        for (i = 0; i < l; i++) {
            ingredient = brew_table[i];

            if (ingredient && ingredient.getIngredientType() === ingredient_type) {
                amount++;
            }
        }

        return amount;
    };

    BrewTable.prototype.getIngredientTypes = function() {
        var types = [],
            ingredient, brew_table = this.brew_table,
            i, l = brew_table.length;

        for (i = 0; i < l; i++) {
            ingredient = brew_table[i];

            if (ingredient) {
                types.push(ingredient.getIngredientType());
            }
        }

        return types;
    };

    BrewTable.prototype.cleanTable = function() {
        var i, l = this.brew_table.length;

        for (i = 0; i < l; i++) {
            this.removeIngredient(i);
        }
    };

    us.extend(BrewTable.prototype, Backbone.Events);

    window.BrewTable = BrewTable;
}());