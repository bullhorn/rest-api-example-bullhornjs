// 'use strict';
/* Controllers */
function MainCtrl($scope, $http, $location, $timeout) {
    $scope.jobs = [];
    $scope.candidates = [];
    $scope.totalJobs = 0;
    $scope.totalCandidates = 0;

    var login = "http://jimmy-backend:8181/core/oauth/authorize";
    var bh = new Bullhorn();
    bh.authenticate(login).then(function(ping){
        var js = new JobSearch()
            .fields('id', 'title')
            .params({count:20, showTotalMatched:true})
            .query('isDeleted:0');

        var cs = new CandidateSearch()
            .fields('id', 'name')
            .params({count:20,showTotalMatched:true})
            .query('isDeleted:0');// AND recruiterIDs:'+me);

        js.run().then(function(response){
            $scope.totalJobs = response.total;
            $scope.jobs = js.records;

            cs.run().then(function(response){
                $scope.totalCandidates = response.total;
                $scope.candidates = cs.records;

                if(!$scope.$root.$$phase) $scope.$apply();
            });
        });
    });

    $scope.spin = function(){
        $('#ring-1').removeClass('ring');
        $('#ring-2').removeClass('ring');

        $timeout(function(){
            $('#ring-1').addClass('ring');
            $('#ring-2').addClass('ring');
        });

        $scope.getRandomJob();
        $scope.getRandomCandidate();
    }

    $scope.getRandomJob = function(){
        var n = Math.floor(Math.random() * $scope.totalJobs + 1);

        var job = new JobSearch()
            .fields('id','title','clientCorporation(name)')
            .params({start:n,count:1})
            .query('isDeleted:0');

        job.run().then(function(data){
            $scope.jobs[12] = job.records[0];
            //if(!$scope.$root.$$phase) $scope.$apply();
        });
    }

    $scope.getRandomCandidate = function(){
        var n = Math.floor(Math.random() * $scope.totalCandidates + 1);

        var candidate = new CandidateSearch()
            .fields('id','name','phone','mobile')
            .params({start:n,count:1})
            .query('isDeleted:0');

        candidate.run().then(function(data){
            $scope.candidates[12] = candidate.records[0];
            if(!$scope.$root.$$phase) $scope.$apply();
        });
    }
}
