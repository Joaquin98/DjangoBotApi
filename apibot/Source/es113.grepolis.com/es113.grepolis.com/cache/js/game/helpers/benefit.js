/* globals MM, DM */
define('helpers/benefit', function() {
    'use strict';

    var BenefitTypes = require('enums/benefit_types');
    var Happenings = require('enums/happenings');

    return {
        isMissionsEventRunning: function() {
            var benefits = MM.getOnlyCollectionByName('Benefit'),
                missions_benefit = benefits.find(function(benefit) {
                    return benefit.getType() === Happenings.MISSIONS && benefit.isRunning();
                });

            return typeof missions_benefit !== 'undefined';
        },

        getWindowType: function() {
            var benefits = MM.getOnlyCollectionByName('Benefit');

            return benefits.getFirstRunningBenefitOfTypeWithoutPrerequisites(BenefitTypes.LARGE_ICON).getLargeIconData().window_type;
        },

        getBenefitSkin: function(type) {
            var benefits = MM.getOnlyCollectionByName('Benefit'),
                benefit_skin = '';

            if (!benefits || benefits.length === 0) {
                return;
            }

            if (typeof type === 'undefined') {
                type = BenefitTypes.LARGE_ICON;
            }

            if (type === BenefitTypes.LARGE_ICON && benefits.getFirstRunningBenefitOfTypeWithoutPrerequisites(type)) {
                var large_icon_type = benefits.getFirstRunningBenefitOfTypeWithoutPrerequisites(type).getLargeIconData().window_type;
                benefit_skin = benefits.getSkinForTheLargeIconOfWindowType(type, large_icon_type);
            } else if (benefits.getFirstRunningBenefitOfType(type)) {
                var benefit = benefits.getFirstRunningBenefitOfType(type),
                    params = benefit.get('params');

                benefit_skin = params.skin ? params.skin : '';
            }

            return benefit_skin;
        },

        getl10nForSkin: function(l10n, name, type) {
            if (typeof type === 'undefined') {
                type = BenefitTypes.LARGE_ICON;
            }

            var skin = this.getBenefitSkin(type),
                translation = DM.getl10n(skin),
                extra_l10n = translation[name];

            return $.extend(true, l10n, extra_l10n);
        },

        getl10nPremiumForSkin: function(l10n, name, type) {
            if (typeof type === 'undefined') {
                type = BenefitTypes.LARGE_ICON;
            }

            var skin = this.getBenefitSkin(type),
                extra_l10n = DM.getl10n(skin),
                keys = ['premium', name, 'confirmation'];

            keys.forEach(function(key) {
                extra_l10n = extra_l10n ? extra_l10n[key] : extra_l10n;
            });

            return $.extend(true, l10n, extra_l10n);
        },

        getRunningPeaceTimeHappening: function() {
            var benefits = MM.getOnlyCollectionByName('Benefit');

            return benefits.getFirstRunningBenefitOfType(BenefitTypes.PEACE_TIME);
        },

        getEventEndAt: function() {
            var benefits = MM.getOnlyCollectionByName('Benefit'),
                benefit = benefits.getFirstRunningBenefitOfType(BenefitTypes.LARGE_ICON);

            if (benefits.length > 0 && benefit) {
                return benefit.getEnd();
            }

            return 0;
        }
    };
});