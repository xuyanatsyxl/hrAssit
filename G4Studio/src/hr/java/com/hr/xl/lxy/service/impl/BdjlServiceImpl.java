package com.hr.xl.lxy.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hr.xl.lxy.service.BdjlService;
import com.hr.xl.system.utils.IDHelper;

public class BdjlServiceImpl extends BaseServiceImpl implements BdjlService {

	public void saveLxybdjlItem(Dto pDto) {
		String hrEventID = IDHelper.getHreventID();
		pDto.put("HR_EVENTID", hrEventID);
		pDto.put("bdzt", "0");
		pDto.put("bdrq", G4Utils.Date2String(pDto.getAsTimestamp("bdrq"), "yyyyMMddHHmmss"));
		pDto.put("hqxjrq", G4Utils.Date2String(pDto.getAsDate("hqxjrq"), "yyyyMMdd"));
		pDto.put("xjjsrq", G4Utils.Date2String(pDto.getAsDate("xjjsrq"), "yyyyMMdd"));
		g4Dao.insert("LXYBDJL.saveLxybdjlItem", pDto);
	}

	public Dto deleteLxybdjlItem(Dto pDto) {
		// TODO Auto-generated method stub
		String[] checked = pDto.getAsString("strChecked").split(",");
		Dto dto = new BaseDto();
		for (int i = 0; i < checked.length; i++) {
			dto.put("HR_EVENTID", checked[i]);
			g4Dao.delete("LXYBDJL.deleteLxybdjlItem", dto);
		}
		return null;
	}

	public Dto updateLxybdjlItem(Dto pDto) {
		// TODO Auto-generated method stub

		pDto.put("hqxjrq", G4Utils.Date2String(pDto.getAsDate("hqxjrq"), "yyyyMMdd"));
		g4Dao.update("LXYBDJL.updateLxybdjlItem", pDto);
		return null;
	}

}
