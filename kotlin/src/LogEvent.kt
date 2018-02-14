// Copyright 2018 Sourcerer Inc. All Rights Reserved.
// Author: Alexander Surkov (alex@sourcerer.io)

package sourcererio.vacuumanalytics

import com.github.kittinunf.fuel.core.FuelError
import com.github.kittinunf.fuel.core.FuelManager
import com.github.kittinunf.fuel.core.Method
import com.github.kittinunf.fuel.core.Request
import com.github.kittinunf.fuel.core.Response
import java.net.HttpCookie
import java.util.Date

/**
 * Elastic LogStash logging.
 */
class LogEvent {
    // Unique identifier of the session.
    private var session: String = ""

    private val fuelManager = FuelManager()

    /**
     * Creates a LogEvent instance.
     *
     * @param path [in] path to send logs to,
     * @param res  [in] HTTP response of successful user authorization,
     * @param sid  [in] session id of the HTTP response.
     */
    constructor(path: String,
                res: Response, sid: String) {
        res.headers["Set-Cookie"]?.
            flatMap { HttpCookie.parse(it) }?.
            find { it.name == sid }?.
            let { session = it.value }

        fuelManager.basePath = path
    }

    /**
     * Logs error.
     */
    fun error(message: String) {
        event("error", message)
    }

    /**
     * Logs event.
     */
    fun event(type: String, message: String) {
        event(type, listOf("message" to message))
    }

    /**
     * Logs event.
     */
    fun event(type: String, fields: List<Pair<String, Any?>>) {
        var params = mutableListOf<Pair<String, Any?>>(
            "session" to session,
            "type" to type,
            "timestamp" to Date().getTime()
        )

        fuelManager.
            request(
                Method.POST,
                "",
                params.plus(fields)
            )
            .response { _, _, result ->
                val (_, err) = result
                if (err != null) {
                    throw Exception("FAILED to send logs: $err")
                }
            }
    }
}
