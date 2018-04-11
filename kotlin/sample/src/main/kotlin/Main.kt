// Copyright 2018 Sourcerer Inc. All Rights Reserved.
// Author: Alexander Surkov (alex@sourcerer.io)

package sample

import com.github.kittinunf.fuel.core.Response
import java.net.URL
import vacuumanalytics.LogEvent

fun main(argv : Array<String>) {
  val fakeResponse = Response(
    url = URL("http://0.0.0.0"),
    headers = mapOf("Set-Cookie" to listOf("sessionid=kotlintst"))
  )
  val logger = LogEvent("http://0.0.0.0:8080", fakeResponse, "sessionid")
  logger.error("B'eba-%pBeba")
}
