function getProvince() {
    $.ajax({
        type: 'post',
        data: {key: mapKey, subdistrict: 1},
        url: 'https://restapi.amap.com/v3/config/district',
        success: function (res) {

            if (res.status == '1') {
                province = res.districts[0].districts;
                console.log("省====");
                console.log(province);
                for (var i = 0; i < province.length; i++) {
                    $('#flow_province').append('<p data-index="' + i + '">' + province[i].name + '</p>');
                }

                $('#flow_province p').click(function () {
                    $('#flow_city').empty();
                    $('#flow_area').empty();
                    provinceName = $(this).text();

                    $(this).addClass('active').siblings().removeClass('active');
                    $('#province').val($(this).text());
                    $('#city').val('');
                    $('#area').val('');

                    $(this).parent().hide();

                    getCity(provinceName);
                });
            }
        }
    });
}