import {
    getList as getListApi,
    createPlant as createPlantApi,
    deletePlant as deletePlantApi
} from '../api/inventoryApi.js';

function beginLoading() {
    return {
        type: "@PLANTLIST/BEGIN_LOADING",
    };
}

function endLoading() {
    return {
        type: "@INVENTORY/END_LOADING",
    };
}

function endShowList(plantList) {
    return {
        type: "@INVENTORY/END_SHOW_LIST",
        plantList: plantList
    };
}

export function getLists(googleId) {
    return (dispatch, getState) => {
        dispatch(beginLoading());

        return getListApi(googleId).then(plantList => {
            dispatch(endShowList(plantList));
            dispatch(endLoading());

            return plantList;
        }).catch(err => {
            console.error('[INVENTORY] Error listing plants', err);
        });
    };
}

export function createPlant(plantName, plantType, potArea, potVolume, googleId) {
    return (dispatch, getState) => {
        dispatch(beginLoading());

        return createPlantApi(plantName, plantType, potArea, potVolume, googleId).then(() => {
            dispatch(getLists(googleId));
        }).catch(err => {
            console.error('[INVENTORY] Error creating plant', err);
            dispatch(endLoading());
        });
    };
}

export function popUpCon(toggle, plantId, plantname, planttype, plantstatus, createdtime, waterevents) {
    return {
        type: '@INVENTORY/POP_UP_CON',
        toggle,
        plantId,
        plantname,
        planttype,
        plantstatus,
        createdtime,
        waterevents
    };
};

export function deletePlant(plantId, googleId) {
    return (dispatch, getState) => {
        dispatch(beginLoading());

        return deletePlantApi(plantId).then(() => {
            dispatch(getLists(googleId));
        }).catch(err => {
            console.error('[INVENTORY] Error deleting plant', err);
            dispatch(endLoading());
        });
    };
}
