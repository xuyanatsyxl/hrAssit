package com.hr.xl.kq.device;

import java.io.IOException;
import java.net.UnknownHostException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hanvon.faceid.sdk.FaceId;
import com.hanvon.faceid.sdk.FaceIdAnswer;
import com.hanvon.faceid.sdk.FaceId_ErrorCode;

public class HanvonDeviceClient {
	private static Log log = LogFactory.getLog(HanvonDeviceClient.class);
	public final String deviceCharset = "GBK";
	public FaceId tcpClient = null;
	public String port = "9922";
	public String ip = null;

	private FaceId_ErrorCode executeDeviceCommand(String command,
			FaceIdAnswer output) {
		if (G4Utils.isEmpty(output)) {
			output = new FaceIdAnswer();
			// 测试一下更新结果
		}
		FaceId_ErrorCode errorCode = tcpClient.Execute(command, output,
				deviceCharset);
		return errorCode;
	}

	public HanvonDeviceClient(String aip, String aport)
			throws NumberFormatException, UnknownHostException, IOException {
		this.ip = aip;
		this.port = aport;
		this.tcpClient = new FaceId(aip, Integer.valueOf(aport));
		FaceIdAnswer output = new FaceIdAnswer();
	}

	public void Close() throws IOException {
		if (G4Utils.isNotEmpty(tcpClient)) {
			tcpClient.close();
			tcpClient = null;
		}
	}

	// 设置服务器IP地址
	public Dto setServerIp(String srvIp) {
		Dto outDto = new BaseDto();
		String command = "SetClientStatus(status=\"enable\" hostip=\"" + srvIp
				+ "\")";
		FaceIdAnswer answer = null;
		FaceId_ErrorCode error = executeDeviceCommand(command, answer);
		outDto.put("success", error.equals(FaceId_ErrorCode.Success));
		outDto.put("msg", answer.answer);
		return outDto;
	}

	public boolean setEmployee(int id, String name, String card) {
		String command = "SetEmployee(id=\"%d\" name=\"%s\" calid=\"0\" card_num=\"0X%s\" authority=\"0X55\" check_type=\"card\" opendoor_type=\"card\")";
		String cmd = String.format(command, id, name, card);
		FaceIdAnswer answer = null;
		FaceId_ErrorCode error = this.executeDeviceCommand(cmd, answer);

		return error.equals(FaceId_ErrorCode.Success);
	}
}
