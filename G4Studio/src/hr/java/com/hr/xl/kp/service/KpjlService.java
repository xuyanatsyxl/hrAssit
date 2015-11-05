package com.hr.xl.kp.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface KpjlService extends BaseService {

	public Dto saveKpjlItem(Dto pDto);

	public Dto updateKpjlItem(Dto pDto);

	public Dto deleteKpjlItem(Dto pDto);

}
