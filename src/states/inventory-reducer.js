const initInventoryState = {
    plantList: [],
    loading: false,
    toggle: false,
    popPlantname: null,
    popPlanttype: null,
    popPlantstatus: null,
    popCreatedTime: -1,
    popWaterEvents: 0
}

export function inventory(state = initInventoryState, action) {
    switch (action.type) {
        case "@INVENTORY/BEGIN_LOADING":
            return {
                ...state,
                plantListIsLoading: true
            };
        case "@INVENTORY/END_LOADING":
            return {
                ...state,
                plantListIsLoading: false
            };
        case "@INVENTORY/END_SHOW_LIST":
            return {
                ...state,
                plantList: action.plantList
            };
        case '@INVENTORY/POP_UP_CON':
            return {
                ...state,
                toggle: action.toggle,
                popPlantId: action.plantId,
                popPlantname: action.plantname,
                popPlanttype: action.planttype,
                popPlantstatus: action.plantstatus,
                popCreatedTime: action.createdtime,
                popWaterEvents: action.waterevents
            };
        default:
            return state;
    }
}
