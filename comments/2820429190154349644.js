window.g_loadAllComments = function() {
  if (window.isCommentInited) {
    return {
      feed: {}
    }
  }

  var comments = atob('H4sICG1YJmQAAzI4MjA0MjkxOTAxNTQzNDk2NDQuanNvbgDtW3tz1NYV/yqaNcM0U3alq7e2cVLj2GCatAGvC2ndyWh37z6wVlokLbaboWPjAH7gOCRgwDUFUgw0KXbSAl2/P0Kbz9DVrvwXX6HnSn6sze56wU6ydMwY2dI99+jo3HvP73eOrj4JnMemlTb0QDiAQkzgSADrMSOe1pNwoSvSHpThUgLjeCD8SaAvo+kWXE/ZdjZM0729vaFeLmSYSZplGIFusY0MSHtSh4ws1juxasZSWx1UJRQzMnSQtrI4RhMJy5OgUQjRmz2T8a0eViyFM6oVShpGUsNeb/9mIJ2MH8K2Suw8TXcHWts+ONZ53PgjTmeljkyLcqavXT3W1hXqDoBo2jP/kA2y0CMc1YxkEptE3RGkKIp3ISiwnCAoDBJ4xAosK7KSEsoals3KLMOzCvKaOF4ReT5EumawbluBC0cCuWxctfHWLViG5YIMF2SlCGLCDBNmlRAvsz9nZDghHey0reFN8dZ1VZShU6WlydLjsbWpieLQP0tTnzrjU87sV2GqkB8pPRov5BeLzwapUx0tVHF0oDg9V5gfKyyMvFi6Wli+587NOA8vFpZvrA2MOH8Ze7F0l9xJS+s9gfDvPwmYWKvDq03eSIOB/VmwL6Bms1o6ptowPWgVBvfnMEDQmjJxYl2ZBdqyppE01UzQTsHNQsSVVtawPa1EnUVv+IqO44Sa02wwbMMgC2uJV70fmXZlI7h+kwqjR1cYuZeMeVfV7OazlqEfzuaiWtpK4Xgwo/Y1lw0iI4QRG+ZRSETc7w5DY9DEFnS1mgWGOWxisoJws23m8GHDjGMz2t+8qevw+Wa27HnhZtjUYbZsPbSN+2w6Zb+iZ2G0FJphaTOtgjXn07g3mNBUKxW00hrYo6WTKTt4Vj2vJvpCnvItG1K56PZbkTvlolYuCi3RXDQEw7B5n8CFPxwJqDk7ZZjePNLVzNbMLZ+t3kIw05ttZTGifLDgkRJpDdMISTziBJEXFU6SYcREFhEVMC/T2qYS3TBxVuv/ZZkGIgQrP51Rk54hdU5sO5XLRHWi+0igNx23SVRiReIHTFwFZxwLZ5YZgz9pmg9Fs9sdHjwW6Uix2fgf3/uog/6tHTOPiuYZJttBt6z/O9qVpM+fjr/X19bF/1qM0RbLMnSEjBwYfjabDFwgrkxiHZswt01i+1bolUIMib2eA6u4Dpo9nxz1LxE/bMXYQ7Zhq9opf1oGwsq2NstWTbtDj+O+TceiHd3TNs5YH2LzQ8+rCkEB2+z3RnxHmO35qPXkGV7CrX6YPd3325PH2k7uQ5gN8iJc5uCcE1ieF3iRIysnsLmUyuIrowQZNsiIEYTCSISoCu5jtuLrywF5lw4w4w/heNoug7lDcK0a1Ek0aTxSp/Lt0b44PeCuXnOmHzuDUxDJSZBfuF66/hiiePHJX51/PYKmiJF9X9WTORiMQn7Unf1q7dalwsJliPIgTpz434GLzrVn8PMnAg3Og0c+NBRvzRX/cb84PbJ2/TboAyQIhULEhJih2zCixIj1qLMecH4Qk94+eop+p7ZdxbG/Qb/Cyp3i+Oza0GNn+DKcurOP3dmF0o2Z4q0Vd/JTZ+k7UFoBxchI/bSgQVeYq+9uj/Q/PbLVYeRPBkfvWimjd534NCOW42R4EhGWDdMUqxQHNldRoCYg/apfw9QHIep9jCvhUSUfbwASIzHgRVFEgsRwiGEZUZF+bEDyHrQSIK1r415CpY+jUns8wqNsv9RLd37Q3nUyGO+QerdQqfWcQX/UwR7v64tnkxme7iSo1ANuCvWlQ6pOgOndmApWNnMJjFQuEeNEBbMCQojHEo4iNQreiHEc9vHLTpmH0nrQ80LQNrbCJTSU0wlT84Kl1a/HN+Y9SGA1TvtZxg/IdI4EfN2vAUEVlhUZAyNnxnB1TlN9mRKlW+uxsvaX1p0/n+AUA2THPzQBpk27v2yyBzZuTlC7FXxhgZrzqpYjbdl0PCghXuAUReS8pb6jUzxtZTW1P5LO4LJuxMvO/FO2OD0sFm/OUBtQBsuN6NhBApi2th0kQG1j9iPXCsoCLEEFMbwoSzyHFPBTLRLABxGKQIbFM3WSgBod9k4CaijfTgK6A8W56yRdy4+7Q8vOyrAzs+xMf1u88dT5fPjD99q7A1SQUuNGFFPeXKeyatanfLWR/PX1Nh7EVpgJjQexuxvZMBCrcLKPsACxlVZZnRDboht6f8bIWT82OKJt2Zp3tgWOxHfpTBJ5LiP/PW1whY5qKngymU5swJzKyyoblZmEmIjJiMOCIiU4rEpqTIgiSAkPYO5NgTlOkAQkMdKrwxwPMIcQwbmNaF0R595ri7We4ixlo6Z4uu9E17Euaz9wTpBEQVYkaJd4QRBZRVBq4ZwUREqEUcKID7NiCOR3w7kaHfaOczWUb8c5d2zGfTgI6WPLiZYzzhdXi9N/L05eKY5AvvktJHyQbG4WMtduPoX007my4GeHJPccvgYy/mnx3jxkipBHvliacv68QpTMXS+sjEGC2K136yDqzj4o5BeguVsHACz+Zbr0z8XS4l3n8qW6cuAfw9K3oyZFv+Mfyy32r+yw2pmdh+QZbCLJ8+QV58nNwur94uAcqfbmx53Z6bUrVyBHb9dwH925FSKg+Xjkg/fp1s5O+gRECytmprM2Vbx5D1JrUAVP6Gsj+fb9x6XPvoWHdVe+dC7NFCfn1+58RfLzoWXiixmPQDyY2mF5uZ2+SYX8zNqVcUjm3WeT8MjO8lfkODRBPOPREZB0Z+/DxcLiQGF+GG4NTc7EnDsw5N6+BvYU8k9ednXDJv8V1m7jMZPdjWwUZsJLiigyoghGNsUqxcU6mckJTe155bQfMYokywID+RKryAL8LfNvCrNBYtA0cgQ9y/hNVFWQGucxpOwCF42hGMtzshCPSaoqSgk1ccBv3hh+wzJA0QVFll+Z30iE3ygev/FQuhq/6eGPnTxuBHH/Or9JnYq2M/J+8BtWFIFcS4IswsoSOcgwhGr8BrFe+RwYBRtGQphFIV7gavGbXTrsjd/sonxHMf/GU/jhwOPu6hXns8XCwmUCeh4FcFdvkwZSTZ+45VyddJ+POaOrpPkWIOY4HN37M86lS4X8QCE/BtKF/NcAhaVv7rmDF18s3QUeM/HQeTDpv951bswUbz53Bm67g6PqWbXPuTEKMi+WhoFIOMNT9dX5f0Br17lB/RY7SwPOozHnyUNYIWetF0sjDQv3FaZy48H97kY2CNxzrCyxvMKSEmVTrFKYqBPuS7ceuhdHCvk7bwpcHxQi/l+B+rUKEYhdr7f7OO2hTRWcbunpOnaKM/hE6xZOH2vr2Zd6Oy/D2kOsBBd58iKOrVpv95ERMRHEhjmGZP7g1N1xumqH/cDpqsq347RtUJvholsn4PTdpdKnz92h5eLIijP8LYE+Z2Sc5MQDg05+0nnyORV+q1t35+64c0/X349fuQdSVAtAGeU+Hy3emYFjaegJQbvVBchmC4sz6wntyAog39rNp6WL83UBc7l5PpDWa6IvvXcz3blPfWRvWBSuMFEbD4V3N7JxUBhsJVZyfFOsUhCoF4V32QJWM/du5D1gG8b/ADvB1gkAk+CjMZyIYhUxSkKIi+B7CHPAgVhBwQJ/QADeGAKABDJ94Si+FgNAjPfK3QOyqq8i2o6e0q3+ROcGBTh6sq1rX165g9WKwMAcRIgROUaUWakqBfC2xCIuwrJhQQpzUkhQhJoUoHaHPVKA2sq3U4DjacpOYRMfoToorJ81+imyOL6f1JOUqmmUkaD6YdZRxCMhENHSPbgu7H4NvRTg/b9HzLT9n2eUCldssJP6ftCPzaTRymX/PWiYNukaKq+9+8fM90OURXr/gnpbpcjCbu4ud9ivcRJbRjCWsUJxTPfiKAjjj7Fp2VjTsP5xHHvrtjsApmrQVTcShqYZvd2Bd4gwBmlqU/ptWn2nMRlBhXnbeIxgdyMbhRGIHJJFETIZRWiKVYoJBxsEDvLyNwuWXy8vJ5kWR1CZI6jsY0vVxJxvPanLQmwzMVcibT3GvhTQZU5QwEciy8nwGAzDVN0Nj/ggg4Is8lJhMcxwIcTKNVG5doc9onJt5dtR2RmfKuQXITel1i7+tZD/2r204s7OQZILQHTuHPUz+MWGzp0jTnuLSJEYjqE5HdOMXJz6mb9u6gLq/bmV//D+NW/Sv0WVblz135tTZDf83Zm1wS9J0dx71e2/yXYGp0hh/fOblb/KagAsrTDbGg9LdzeyUbBUYVhJVgBRWbkpVmkl14mlXXqPbvTqbaZpmAdwegCnbyKc8gCnCOCURRtJbtV95S09HS0nz/TwW++jlVP7lORyZEFyDM/JHGJAimHEWnDKBhEbIQV5NswyIYmr/T66doe9w2kN5dvhNPIbqjxkkAL2U7+uS2q/ww+Kk08AiEqLE2tfX/W2zvmbuQC3iqOjxWcT7qNh5/bjQp5IUe1kORQnvigsPqecL65SJ9TzdQHtDiM2StS1DCnfWVa3Mer66drQcunhoP+9mjtw1Z2bKS1fK31zm3Q7jaM+PJM9cxM3neXvnC/HQe7F0rAz/7yQvw7SRGgdxJ2VYXcUREDVCGEJAODTI94uuEfem/E5Uo4feATwDrejyFZBqjHxvMJ0bzw8393IhsFzFsmywEPo45pilUJJOZ5vWg9HL1I0KGs6qOofVPUP+M7+V/X5jao+6xEeD7arfUjXJbd2nmGCGx/SnTnarrbtzwcGZEONxMEiZDgkKQIcqlb1WYZk7EiMIDHMSWFeDnFCzQ/pdumwN8Kzi/Id9YPP7pI33Ku3Cwt/LuSn3ZlVb78a+eicsIHV2+79q4X8lDNxzfnuRmH+rvPga2f1m8LC5TrqBXtR3XiMoMJ8aDxGsLuRDcIIBElBIieLgK1MU6zSWjuolh+k928W3L1Wes8y6+k98j8b92K2j3Z/uHDhf8XHjMBeTAAA');
  var inputArray = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) {
    inputArray[i] = comments.charCodeAt(i);
  }
  var outputArray = pako.inflate(inputArray);
  window.isCommentInited = true;
  return JSON.parse(new TextDecoder("utf-8").decode(outputArray));
}