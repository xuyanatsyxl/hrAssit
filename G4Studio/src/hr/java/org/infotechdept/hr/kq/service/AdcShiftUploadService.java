package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftUploadService extends BaseService {
	public Dto saveAdcShiftUploadItem(Dto pDto);

	public Dto delFiles(String fileid);
}
