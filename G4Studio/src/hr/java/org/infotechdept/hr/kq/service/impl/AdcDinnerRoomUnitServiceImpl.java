package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcDinnerRoomUnitService;

public class AdcDinnerRoomUnitServiceImpl extends BaseServiceImpl implements
		AdcDinnerRoomUnitService {

	public Dto saveAdcDinnerRoomUnitItem(Dto pDto) {
		Dto outDto = new BaseDto();
		Integer temp = (Integer) g4Dao.queryForObject("AdcDinnerRoomUnit.checkUnitIsExists", pDto);
		if (temp.intValue() > 0){
			outDto.put("success", new Boolean(false));
			outDto.put("message", "指定的就餐单位已经有食堂！");
			return outDto;
		}
		g4Dao.insert("AdcDinnerRoomUnit.saveAdcDinnerRoomUnitItem", pDto);
		outDto.put("success", new Boolean(true));
		outDto.put("message", "就餐单位添加成功！");
		return outDto;
	}

	public Dto deleteAdcDinnerRoomUnitItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("id", arrChecked[i]);
			g4Dao.delete("AdcDinnerRoomUnit.deleteAdcDinnerRoomUnitItems", dto);
		}
		return null;
	}

}
