package org.infotechdept.hr.kq.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface AdcShiftGroupService extends BaseService {

	public Dto saveAdcShiftGroupItem(Dto pDto);

	public Dto updateAdcShiftGroupItem(Dto pDto);

	public Dto deleteAdcShiftGroupItem(Dto pDto);

	public Dto saveAdcShiftGroupEmplItem(Dto pDto);

	public Dto deleteAdcShiftGroupEmplItem(Dto pDto);
}
