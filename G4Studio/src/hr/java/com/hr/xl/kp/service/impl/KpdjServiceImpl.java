package com.hr.xl.kp.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;

import com.hr.xl.kp.service.KpdjService;
import com.hr.xl.system.utils.IDHelper;

public class KpdjServiceImpl extends BaseServiceImpl implements KpdjService {

	public Dto saveKpdjItem(Dto pDto) {
		Dto outDto = new BaseDto();
		String oid = IDHelper.getOID();
		pDto.put("oid", oid);
		g4Dao.insert("KPDJ.saveKpdjItem", pDto);
		outDto.put("success", new Boolean(true));
		outDto.put("msg", String.format("单据保存成功，单据号为[%s]", oid));
		return outDto;
	}

	@Override
	public Dto deleteKpdjItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto updateKpdjItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
