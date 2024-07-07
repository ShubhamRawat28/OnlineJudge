#include<iostream>
#include<vector>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {

        vector<int>v;

        for(int i=0;i<nums.size();i++)

        {

            v.push_back(i);

            for(int j=i+1;j<nums.size();j++)

            {

                if(nums[i]+nums[j]==target)

                {

                    v.push_back(j);

                    return v;

                }

            }

                v.pop_back();

        }

        return v;

    }
int main(){
    int n, target;
    cin>>n,target;
    vector<int>arr(n);
    for(int i=0;i<n;i++)    cin>>arr[i];
    cin>>target;
    vector<int>ans = twoSum(arr,target);
    for(auto it:ans)    cout<<it<<" ";
}