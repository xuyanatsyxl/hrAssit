package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.infotechdept.hr.kq.service.AdcAttendTypeService;

public class AdcAttendTypeServiceImpl extends BaseServiceImpl implements AdcAttendTypeService {

	public Dto saveAdcAttendTypeItem(Dto pDto) {
		String code = null;
		pDto.put("type_id", code);
		g4Dao.insert("AdcAttendType.saveAdcAttendTypeItem", pDto);
		return null;
	}

	public Dto updateAdcAttendTypeItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto deleteAdcAttendTypeItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
