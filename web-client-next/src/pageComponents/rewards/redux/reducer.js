import { EARN_REWARDS } from "../../../constants/codes";
import { OPEN_MENU_ITEM } from "./constants";

const initialState = {
	showEarnRewards: false,
};

const rewardsReducer = (state = initialState, action) => {
	const payload = action?.payload;
	const newState = { ...state };
	switch (action.type) {
		case OPEN_MENU_ITEM:
			newState.showEarnRewards = state.showEarnRewards
				? false
				: payload === EARN_REWARDS;
			return newState;
		default:
			return newState;
	}
};

export default rewardsReducer;
