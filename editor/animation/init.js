//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'convert';

            var checkioInput = data.in || [1, 3];
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput[0]) + ',' + JSON.stringify(checkioInput[1]) + ')';

            var failError = function(dError) {
                $content.find('.call').html('Fail: ' + checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: ' + checkioInputStr);
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: ' + checkioInputStr);
                $content.find('.answer').remove();
            }


            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        ext.set_console_process_ret(function(this_e, ret){
            $tryit.find(".checkio-result").html("Result: " + ret);
        });

        ext.set_generate_animation_panel(function(this_e){

//            $tryit = $(".tryit-results");
            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit')));


            $tryit.find('form').submit(function(e){
                e.preventDefault();
                var numeratorT = $tryit.find('.input-numerator').val();
                var numerator = parseInt(numeratorT);
                var denominatorT = $tryit.find('.input-denominator').val();
                var denominator = parseInt(denominatorT);
                if (isNumber(numerator)){
//                        result_return([numerator, denominator]);
                    if (isNumber(denominator)){
                        this_e.sendToConsoleFunction("convert", numerator, denominator);
                        e.stopPropagation();
                    }
                    else {
                        $tryit.find(".checkio-result").html('Please enter a number at Denominator');
                    }
                }
                else {
                    $tryit.find(".checkio-result").html('Please enter a number at Numerator');

                }
                return false;
            });

        });


    }
);
