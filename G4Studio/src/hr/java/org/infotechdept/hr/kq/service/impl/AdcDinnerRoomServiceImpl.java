package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.infotechdept.hr.kq.service.AdcDinnerRoomService;

import com.hr.xl.system.utils.IDHelper;

public class AdcDinnerRoomServiceImpl extends BaseServiceImpl implements
		AdcDinnerRoomService {

	
	public Dto saveAdcDinnerRoomItem(Dto pDto) {
		String roomId = IDHelper.getRoomId();
		pDto.put("room_id", roomId);
		g4Dao.insert("AdcDinnerRoom.saveAdcDinnerRoomItem", pDto);
		return null;
	}

	public Dto updateAdcDinnerRoomItem(Dto pDto) {
		g4Dao.update("AdcDinnerRoom.updateAdcDinnerRoomItem", pDto);
		return null;
	}

	public Dto deleteAdcDinnerRoomItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("room_id", arrChecked[i]);
			Integer temp = (Integer)g4Dao.queryForObject("AdcDinnerRoom.checkCanDelete", dto);
			if (temp.intValue() == 0){
				g4Dao.update("AdcDinnerRoomUnit.deleteAdcDinnerRoomUnitByRoomIdItems", dto);
				g4Dao.delete("AdcDinnerRoom.deleteAdcDinnerRoomItems", dto);
			}
		}
		return null;
	}

	@Override
	public Dto saveAdcDinnerRoomDkjItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto updateAdcDinnerRoomDkjItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto deleteAdcDinnerRoomDkjItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	public Dto saveDinnerRoom(Dto pDto) {
		g4Dao.delete("AdcDinnerRoom.deleteAdcDinnerRoomDkjByRoomId", pDto);
		String[] userids = pDto.getAsString("dkjid").split(",");
		for(int i = 0; i < userids.length; i++){
			String userid = userids[i];
			if(G4Utils.isEmpty(userid))
				continue;
			pDto.put("dkjid", userid);
			g4Dao.insert("AdcDinnerRoom.saveAdcDinnerRoomDkjItem", pDto);
		}
		return null;
	}

}
