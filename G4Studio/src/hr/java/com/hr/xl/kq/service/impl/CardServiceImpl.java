package com.hr.xl.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hr.xl.kq.service.CardService;

public class CardServiceImpl extends BaseServiceImpl implements CardService {

	@Override
	public Dto saveEmpcardItem(Dto pDto) {
		BaseDto outDto = new BaseDto();
		pDto.put("empid", pDto.getAsBigDecimal("c_employeeid"));
		pDto.put("dzsj", G4Utils.getCurrentTimestamp());

		Integer temp = (Integer) g4Dao.queryForObject(
				"Empcard.checkCardExists", pDto);
		if (temp.intValue() != 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "IC卡号重复！");
			return outDto;
		}

		temp = (Integer) g4Dao.queryForObject("Empcard.checkEmpExists", pDto);
		if (temp.intValue() != 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "人员重复发卡！");
			return outDto;
		}

		g4Dao.insert("Empcard.saveEmpcardItem", pDto);
		outDto.put("msg", "用户数据新增成功");
		outDto.put("success", new Boolean(true));
		return outDto;
	}

}
