package com.hr.xl.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hr.xl.kq.service.DkjlService;

public class DkjlServiceImpl extends BaseServiceImpl implements DkjlService {

	public Dto saveDkjlItem(Dto pDto) {
		BaseDto outDto = new BaseDto();
		pDto.put("dksj", G4Utils.Date2String(pDto.getAsTimestamp("dksj"),
				"yyyyMMddHHmmss"));
		Integer temp = (Integer) g4Dao.queryForObject("DKJL.checkRecordExist",
				pDto);
		if (temp.intValue() > 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "打卡记录重复");
			return outDto;
		}
		// pDto.put("xid", IDHelper.getXID());
		g4Dao.insert("DKJL.saveDkjlItem", pDto);
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "打卡记录上传成功！");
		return outDto;
	}

}
