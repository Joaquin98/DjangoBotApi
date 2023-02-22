define('prototype/tutorial/guide_steps_definitions', function(require) {
    'use strict';

    //TutorialGuideStepDefinitions
    var BuildingsEnum = require('enums/buildings');
    var ResearchesEnum = require('enums/researches');
    var GroundUnitsEnum = require('enums/ground_units');
    var PremiumFeaturesEnum = require('enums/premium_features');
    var DirectionsEnum = require('enums/directions');

    return {
        // Account Management
        ConfirmEmailQuest: {
            addRegisterFieldUserGuide: []
        },

        EditProfileQuest: {
            addEditProfileGuideStep: []
        },

        // Among friends
        InviteFriendQuest: {
            addInviteFriendsGuideStep: []
        },

        // Beyond the horizon
        BuildDocksQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.DOCKS]
        },

        ResearchBiremeQuest: {
            addResearchUserGuideStep: [ResearchesEnum.BIREME, DirectionsEnum.NORTH]
        },

        TradeSalesmanQuest: {
            addPhoenicianSalesmanGuideStep: []
        },

        // City defense
        BuildWallQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.WALL, DirectionsEnum.EAST]
        },

        RecruitSwordsmanMinorQuest: {
            addRecruitUnitUserGuide: [BuildingsEnum.BARRACKS, GroundUnitsEnum.SWORD]
        },

        // City Management
        BuildFarmLevel5: {
            addBuildBuildingUserGuide: [BuildingsEnum.FARM]
        },

        BuildMainLevel3: {
            addBuildBuildingUserGuide: [BuildingsEnum.MAIN]
        },

        PremiumCuratorQuest: {
            addAdvisorUserGuide: [PremiumFeaturesEnum.TYPE_CURATOR]
        },

        // Council of heroes
        AssignHeroQuest: {
            addAssignHeroGuideStep: []
        },

        FinishIslandQuestWithHero: {
            addIslandQuestGuideStep: ['TheDestroyedShrine']
        },

        TrainHeroQuest: {
            addTrainHeroGuideStep: {}
        },

        // Culture points
        CelebrateGamesQuest: {
            addCelebrateGuideStep: ['games']
        },

        CelebratePartyQuest: {
            addCelebrateGuideStep: ['party']
        },

        // Raids
        CelebrateTriumphQuest: {
            addCelebrateGuideStep: ['triumph']
        },

        // Resource supplies
        BuildIronerLevel2: {
            addBuildBuildingUserGuide: [BuildingsEnum.IRONER, DirectionsEnum.EAST]
        },

        BuildIronerLevel3: {
            addBuildBuildingUserGuide: [BuildingsEnum.IRONER, DirectionsEnum.EAST]
        },

        BuildIronerLevel5: {
            addBuildBuildingUserGuide: [BuildingsEnum.IRONER, DirectionsEnum.EAST]
        },

        BuildLumberLevel3: {
            addBuildBuildingUserGuide: [BuildingsEnum.LUMBER, DirectionsEnum.EAST]
        },

        BuildLumberLevel5: {
            addBuildBuildingUserGuide: [BuildingsEnum.LUMBER, DirectionsEnum.EAST]
        },

        BuildMarketQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.MARKET]
        },

        BuildStonerLevel2: {
            addBuildBuildingUserGuide: [BuildingsEnum.STONER]
        },

        BuildStonerLevel3: {
            addBuildBuildingUserGuide: [BuildingsEnum.STONER]
        },

        BuildStonerLevel5: {
            addBuildBuildingUserGuide: [BuildingsEnum.STONER]
        },

        BuildStorageMinorQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.STORAGE, DirectionsEnum.EAST]
        },

        FinishIslandQuestWithoutHero: {
            addIslandQuestGuideStep: ['TheDestroyedShrine']
        },

        PremiumTraderQuest: {
            addAdvisorUserGuide: [PremiumFeaturesEnum.TYPE_TRADER]
        },

        TradeFarmQuest: {
            addTradeFarmUserGuideStep: []
        },

        TradePlayerQuest: {
            addTradePlayerGuideStep: []
        },

        // secret service
        BuildHideQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.HIDE]
        },

        StoreIronQuest: {
            addStoreIronUserGuideStep: [true]
        },

        // The islands farmers
        ClaimLoadPremiumQuest: {
            addClaimLoadPremiumUserGuideStep: []
        },

        ClaimLoadQuest: {
            addClaimLoadUserGuideStep: []
        },

        ConquerFarmMinorQuest: {
            addAttackFarmUserGuide: [
                [GroundUnitsEnum.SLINGER]
            ]
        },

        ConquerFarmQuest: {
            addAttackFarmUserGuide: [
                [GroundUnitsEnum.SWORD]
            ]
        },

        PremiumCaptainQuest: {
            addAdvisorUserGuide: [PremiumFeaturesEnum.TYPE_CAPTAIN]
        },

        RecruitSwordsmanQuest: {
            addRecruitUnitUserGuide: [BuildingsEnum.BARRACKS, GroundUnitsEnum.SWORD]
        },

        // The power of the gods
        BuildTempleLevel5: {
            addBuildBuildingUserGuide: [BuildingsEnum.TEMPLE]
        },

        BuildTempleMinorQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.TEMPLE]
        },

        BuildTempleQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.TEMPLE]
        },

        CastPowerQuest: {
            addCastPowerUserGuideStep: []
        },

        ChooseGodQuest: {
            addChooseGodUserGuideSetp: ['hera']
        },

        PremiumPriestQuest: {
            addAdvisorUserGuide: [PremiumFeaturesEnum.TYPE_PRIEST]
        },

        RecruitGodsentQuest: {
            addRecruitUnitUserGuide: [BuildingsEnum.BARRACKS, GroundUnitsEnum.GODSENT]
        },

        // together we are strong
        JoinAllianceQuest: {
            addMainMenuGuideStep: ['alliance']
        },

        // Tutorial quests
        BuildBarracksQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.BARRACKS]
        },

        BuildFarmMinorQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.FARM]
        },

        BuildFarmQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.FARM]
        },

        BuildIronerQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.IRONER, DirectionsEnum.EAST]
        },

        BuildLumberMinorQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.LUMBER, DirectionsEnum.EAST]
        },

        BuildStonerQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.STONER]
        },

        BuildStorageQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.STORAGE, DirectionsEnum.EAST]
        },

        ImproveBuildTimeQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.MAIN]
        },

        RenameTownQuest: {
            addTownNameGuideStep: []
        },

        StartTutorialQuest: {
            addStartTutorialUserGuide: []
        },

        // Warfares
        AttackTownQuest: {
            addAttackTownUserGuide: []
        },

        BuildAcademyQuest: {
            addBuildBuildingUserGuide: [BuildingsEnum.ACADEMY]
        },

        BuildBarracksLevel3: {
            addBuildBuildingUserGuide: [BuildingsEnum.BARRACKS]
        },

        PremiumCommanderQuest: {
            addAdvisorUserGuide: [PremiumFeaturesEnum.TYPE_COMMANDER]
        },

        ResearchSlingerQuest: {
            addResearchUserGuideStep: [ResearchesEnum.SLINGER]
        },

        // Bandits camp
        FirstAttackSpotQuest: {
            addAttackSpotGuide: [GroundUnitsEnum.SLINGER]
        },

        BuildFarmingVillage1Quest: {
            buildBPVFarm: []
        },

        DemandResourcesBPVQuest: {
            collectBPVFarmResources: []
        },

        UpgradeFarmingVillage2Quest: {
            upgradeBPVFarmVillage: []
        },

        Win10AttackSpotFightsQuest: {
            addAttackSpotGuide: [GroundUnitsEnum.SLINGER]
        }
    };
});