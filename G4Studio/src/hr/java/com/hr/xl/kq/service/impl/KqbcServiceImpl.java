package com.hr.xl.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;

import com.hr.xl.kq.service.KqbcService;

public class KqbcServiceImpl extends BaseServiceImpl implements KqbcService {

	public Dto updateKqbcjlItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("id", arrChecked[i]);
			dto.put("whr", pDto.getAsString("whr"));
			dto.put("whsj", pDto.getAsBigDecimal("whsj"));
			dto.put("cllx", pDto.getAsString("cllx"));
			dto.put("clsm", pDto.getAsString("clsm"));
			dto.put("bz", pDto.getAsString("bz"));
			dto.put("dkzt", "3");
			g4Dao.update("KQBC_JL.updateKqbcjlItem", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "处理成功！");
		return outDto;
	}

}
