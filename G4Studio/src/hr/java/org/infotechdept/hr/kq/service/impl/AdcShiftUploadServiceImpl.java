package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.infotechdept.hr.kq.service.AdcShiftUploadService;

import com.hr.xl.system.utils.IDHelper;

public class AdcShiftUploadServiceImpl extends BaseServiceImpl implements AdcShiftUploadService {

	public Dto saveAdcShiftUploadItem(Dto pDto) {
		String upfileId = IDHelper.getUpfileId();
		pDto.put("upfileid", upfileId);
		g4Dao.insert("AdcShiftUpload.saveAdcShiftUploadItem", pDto);
		return null;
	}

	public Dto delFiles(String fileid) {
		g4Dao.delete("AdcShiftUpload.deleteAdcShiftUploadItem", fileid);
		return null;
	}
}
